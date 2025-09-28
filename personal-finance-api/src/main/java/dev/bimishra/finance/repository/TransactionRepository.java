package dev.bimishra.finance.repository;

import dev.bimishra.finance.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Pageable variants
    Page<Transaction> findByUserId(UUID userId, Pageable pageable);
    Page<Transaction> findByUserIdAndTxnDateBetween(UUID userId, LocalDate from, LocalDate to, Pageable pageable);

    // Account + user scoped methods (list & pageable)
    List<Transaction> findByAccountIdAndUserId(UUID accountId, UUID userId);
    Page<Transaction> findByAccountIdAndUserId(UUID accountId, UUID userId, Pageable pageable);
    List<Transaction> findByAccountIdAndUserIdAndTxnDateBetween(UUID accountId, UUID userId, LocalDate from, LocalDate to);
    Page<Transaction> findByAccountIdAndUserIdAndTxnDateBetween(UUID accountId, UUID userId, LocalDate from, LocalDate to, Pageable pageable);

    // Aggregates net amount per day (txn_date). Credits are positive, debits negative.
    @Query(value = "SELECT txn_date AS day, SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END) AS total " +
            "FROM transactions " +
            "WHERE user_id = :userId AND txn_date >= :from AND txn_date <= :to " +
            "GROUP BY txn_date ORDER BY txn_date", nativeQuery = true)
    List<Object[]> findDailyNetAmounts(@Param("userId") UUID userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    // Returns day, income (sum of credits), expense (sum of debits) per txn_date
    @Query(value = "SELECT txn_date AS day, " +
            "SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) AS income, " +
            "SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END) AS expense " +
            "FROM transactions " +
            "WHERE user_id = :userId AND txn_date >= :from AND txn_date <= :to " +
            "GROUP BY txn_date ORDER BY txn_date", nativeQuery = true)
    List<Object[]> findDailyIncomeExpense(@Param("userId") UUID userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    // Returns category_id and count of transactions per category for the given user
    @Query(value = "SELECT category_id, COUNT(*) FROM transactions WHERE user_id = :userId GROUP BY category_id", nativeQuery = true)
    List<Object[]> findTransactionCountsGroupedByCategory(@Param("userId") UUID userId);
}
