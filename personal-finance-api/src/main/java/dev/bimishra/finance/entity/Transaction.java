package dev.bimishra.finance.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "transactions", indexes = { @Index(columnList = "user_id, txn_date", name = "idx_txn_user_date") })
public class Transaction {
    // getters & setters
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "account_id", columnDefinition = "uuid", nullable = false)
    private UUID accountId;

    @Column(name = "user_id", columnDefinition = "uuid", nullable = false)
    private UUID userId;

    @Column(name = "category_id", columnDefinition = "uuid")
    private UUID categoryId;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private String currency;

    @Column(name = "txn_date")
    private LocalDate txnDate;

    private String description;
    private Transaction.TransactionType type;

    @Column(nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Instant createdAt;

    @Column(nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (updatedAt == null) {
            updatedAt = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public Transaction() {}

    public enum TransactionType {
        DEBIT, CREDIT, TRANSFER
    }
}
