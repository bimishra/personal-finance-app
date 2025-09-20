package dev.bimishra.finance.repository;

import dev.bimishra.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserIdAndTxnDateBetween(UUID userId, LocalDate from, LocalDate to);
    List<Transaction> findByUserId(UUID userId);
    List<Transaction> findByAccountId(UUID accountId);
}
