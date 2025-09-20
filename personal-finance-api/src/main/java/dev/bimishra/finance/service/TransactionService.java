package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.TransactionDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransactionService {
    List<TransactionDto> listByUser(UUID userId);
    List<TransactionDto> listByUserBetween(UUID userId, LocalDate from, LocalDate to);
    TransactionDto get(UUID id, UUID userId);
    TransactionDto create(TransactionDto dto);
    TransactionDto update(UUID id, TransactionDto dto, UUID userId);
    void delete(UUID id, UUID userId);
}
