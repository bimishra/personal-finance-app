package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.dto.BudgetDto;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.entity.Account;
import dev.bimishra.finance.entity.Budget;
import dev.bimishra.finance.entity.Transaction;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.BudgetMapper;
import dev.bimishra.finance.mapper.TransactionMapper;
import dev.bimishra.finance.repository.AccountRepository;
import dev.bimishra.finance.repository.BudgetRepository;
import dev.bimishra.finance.repository.TransactionRepository;
import dev.bimishra.finance.service.BudgetService;
import dev.bimishra.finance.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository repo;
    private final BudgetMapper mapper;

    public BudgetServiceImpl(BudgetRepository repo, BudgetMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public List<BudgetDto> listByUser(UUID userId) {
        return repo.findByUserId(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<BudgetDto> listByUserAndMonth(UUID userId, LocalDate month) {
        return repo.findByUserIdAndMonth(userId, month).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public BudgetDto get(UUID id, UUID userId) {
        Budget b = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!b.getUserId().equals(userId)) throw new ResourceNotFoundException("Budget not found for user");
        return mapper.toDto(b);
    }



    @Override
    public BudgetDto create(BudgetDto dto) {
        Budget b = mapper.toEntity(dto);
        if (b.getId() == null) b.setId(UUID.randomUUID());
        return mapper.toDto(repo.save(b));
    }

    @Override
    public BudgetDto update(UUID id, BudgetDto dto, UUID userId) {
        Budget existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Budget not found for user");
        existing.setLimit(dto.getLimit());
        existing.setSpent(dto.getSpent());
        return mapper.toDto(repo.save(existing));
    }

    @Override
    public void delete(UUID id, UUID userId) {
        Budget existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Budget not found for user");
        repo.deleteById(id);
    }
}
