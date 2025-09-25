package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.TransactionDto;

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
}
