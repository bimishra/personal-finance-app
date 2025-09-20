package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.BudgetDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BudgetService {
    List<BudgetDto> listByUser(UUID userId);
    List<BudgetDto> listByUserAndMonth(UUID userId, LocalDate month);
    BudgetDto get(UUID id, UUID userId);
    BudgetDto create(BudgetDto dto);
    BudgetDto update(UUID id, BudgetDto dto, UUID userId);
    void delete(UUID id, UUID userId);
}
