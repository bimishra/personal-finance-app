package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.repository.TransactionRepository;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.entity.Account;
import dev.bimishra.finance.entity.Transaction;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.TransactionMapper;
import dev.bimishra.finance.repository.AccountRepository;
import dev.bimishra.finance.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.LinkedHashMap;
import java.math.BigDecimal;

@Service
@Transactional
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository repo;
    private final TransactionMapper mapper;
    private final AccountRepository accountRepo;

    public TransactionServiceImpl(TransactionRepository repo, TransactionMapper mapper, AccountRepository accountRepo) {
        this.repo = repo;
        this.mapper = mapper;
        this.accountRepo = accountRepo;
    }

    @Override
    public List<TransactionDto> listByUser(UUID userId) {
        return repo.findByUserId(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<TransactionDto> listByUserBetween(UUID userId, LocalDate from, LocalDate to) {
        return repo.findByUserIdAndTxnDateBetween(userId, from, to).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public TransactionDto get(UUID id, UUID userId) {
        Transaction t = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getUserId().equals(userId)) throw new ResourceNotFoundException("Transaction not found for user");
        return mapper.toDto(t);
    }

    @Override
    public TransactionDto create(TransactionDto dto) {
        // validate account exists and belongs to user
        Account acct = accountRepo.findById(dto.getAccountId()).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!acct.getUserId().equals(dto.getUserId())) throw new ResourceNotFoundException("Account doesn't belong to user");
        Transaction t = mapper.toEntity(dto);
        if (t.getId() == null) t.setId(UUID.randomUUID());
        // update account balance (simple logic)
        t.setCurrency(acct.getCurrency());
        t.setUserId(acct.getUserId());
        log.info("Creating transaction: {}", t);
        log.debug("Type: {}", t.getType());
        //FIXME: Handle type properly with enum
        if (Transaction.TransactionType.CREDIT == t.getType()) {
            acct.setBalance(acct.getBalance().add(t.getAmount()));
        } else {
            acct.setBalance(acct.getBalance().subtract(t.getAmount()));
        }
        accountRepo.save(acct);
        return mapper.toDto(repo.save(t));
    }

    @Override
    public TransactionDto update(UUID id, TransactionDto dto, UUID userId) {
        Transaction existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Transaction not found for user");
        // For simplicity do not handle balance delta recomputation here. Production must handle ledger adjustments.
        existing.setAmount(dto.getAmount());
        existing.setCategoryId(dto.getCategoryId());
        existing.setDescription(dto.getDescription());
        existing.setTxnDate(dto.getTxnDate());
        existing.setType(dto.getType());
        return mapper.toDto(repo.save(existing));
    }

    @Override
    public void delete(UUID id, UUID userId) {
        Transaction existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Transaction not found for user");
        // revert account balance (simplistic logic)
        Account acct = accountRepo.findById(existing.getAccountId()).orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (Transaction.TransactionType.DEBIT == existing.getType()) {
            acct.setBalance(acct.getBalance().add(existing.getAmount()));
        } else {
            acct.setBalance(acct.getBalance().subtract(existing.getAmount()));
        }
        accountRepo.save(acct);
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, BigDecimal> getDailyNetAmounts(UUID userId, LocalDate from, LocalDate to) {
        if (userId == null) throw new IllegalArgumentException("userId is required");
        if (from == null || to == null) throw new IllegalArgumentException("from and to dates are required");
        if (from.isAfter(to)) throw new IllegalArgumentException("from must be on or before to");
        if (to.isAfter(from.plusYears(1))) throw new IllegalArgumentException("Range cannot exceed 1 year");

        // Initialize series with zeros for each date in range (inclusive)
        Map<LocalDate, BigDecimal> series = new LinkedHashMap<>();
        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            series.put(cursor, BigDecimal.ZERO);
            cursor = cursor.plusDays(1);
        }

        List<Object[]> rows = repo.findDailyNetAmounts(userId, from, to);
        if (rows == null) return series;
        for (Object[] row : rows) {
            if (row == null || row.length < 2) continue;
            Object dayObj = row[0];
            LocalDate day;
            if (dayObj instanceof java.sql.Date) {
                day = ((java.sql.Date) dayObj).toLocalDate();
            } else if (dayObj instanceof LocalDate) {
                day = (LocalDate) dayObj;
            } else {
                day = LocalDate.parse(dayObj.toString());
            }
            BigDecimal total = row[1] == null ? BigDecimal.ZERO : new BigDecimal(row[1].toString());
            series.put(day, total);
        }
        return series;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Map<LocalDate, BigDecimal>> getDailyIncomeExpense(UUID userId, LocalDate from, LocalDate to) {
        if (userId == null) throw new IllegalArgumentException("userId is required");
        if (from == null || to == null) throw new IllegalArgumentException("from and to dates are required");
        if (from.isAfter(to)) throw new IllegalArgumentException("from must be on or before to");
        if (to.isAfter(from.plusYears(1))) throw new IllegalArgumentException("Range cannot exceed 1 year");

        Map<LocalDate, BigDecimal> incomeSeries = new LinkedHashMap<>();
        Map<LocalDate, BigDecimal> expenseSeries = new LinkedHashMap<>();

        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            incomeSeries.put(cursor, BigDecimal.ZERO);
            expenseSeries.put(cursor, BigDecimal.ZERO);
            cursor = cursor.plusDays(1);
        }

        List<Object[]> rows = repo.findDailyIncomeExpense(userId, from, to);
        if (rows == null) return Map.of("income", incomeSeries, "expense", expenseSeries);

        for (Object[] row : rows) {
            if (row == null || row.length < 3) continue;
            Object dayObj = row[0];
            LocalDate day;
            if (dayObj instanceof java.sql.Date) {
                day = ((java.sql.Date) dayObj).toLocalDate();
            } else if (dayObj instanceof LocalDate) {
                day = (LocalDate) dayObj;
            } else {
                day = LocalDate.parse(dayObj.toString());
            }
            BigDecimal income = row[1] == null ? BigDecimal.ZERO : new BigDecimal(row[1].toString());
            BigDecimal expense = row[2] == null ? BigDecimal.ZERO : new BigDecimal(row[2].toString());
            incomeSeries.put(day, income);
            expenseSeries.put(day, expense);
        }

        return Map.of("income", incomeSeries, "expense", expenseSeries);
    }
}
