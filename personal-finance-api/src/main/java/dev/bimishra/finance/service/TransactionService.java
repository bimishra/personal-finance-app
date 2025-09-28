package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.TransactionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.math.BigDecimal;

public interface TransactionService {
    List<TransactionDto> listByUser(UUID userId);
    List<TransactionDto> listByUserBetween(UUID userId, LocalDate from, LocalDate to);
    TransactionDto get(UUID id, UUID userId);
    TransactionDto create(TransactionDto dto);
    TransactionDto update(UUID id, TransactionDto dto, UUID userId);
    void delete(UUID id, UUID userId);

    // Returns an ordered map (insertion order) of LocalDate -> net amount (credits positive, debits negative)
    Map<LocalDate, BigDecimal> getDailyNetAmounts(UUID userId, LocalDate from, LocalDate to);

    // Returns two ordered maps keyed by LocalDate: "income" -> daily income, "expense" -> daily expense
    Map<String, Map<LocalDate, BigDecimal>> getDailyIncomeExpense(UUID userId, LocalDate from, LocalDate to);

    // Pageable variants for listing to support large datasets and client-side pagination
    Page<TransactionDto> listByUser(UUID userId, Pageable pageable);
    Page<TransactionDto> listByUserBetween(UUID userId, LocalDate from, LocalDate to, Pageable pageable);
}
