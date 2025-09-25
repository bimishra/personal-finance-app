package dev.bimishra.finance.repository;

import dev.bimishra.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserIdAndTxnDateBetween(UUID userId, LocalDate from, LocalDate to);
    List<Transaction> findByUserId(UUID userId);
    List<Transaction> findByAccountId(UUID accountId);

    // Aggregates net amount per day (txn_date). Credits are positive, debits negative.
    @Query(value = "SELECT txn_date AS day, SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END) AS total " +
            "FROM transactions " +
            "WHERE user_id = :userId AND txn_date >= :from AND txn_date <= :to " +
            "GROUP BY txn_date ORDER BY txn_date", nativeQuery = true)
    List<Object[]> findDailyNetAmounts(@Param("userId") UUID userId, @Param("from") LocalDate from, @Param("to") LocalDate to);
}
