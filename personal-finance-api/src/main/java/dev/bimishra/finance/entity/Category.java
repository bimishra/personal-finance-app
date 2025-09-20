package dev.bimishra.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "categories", indexes = { @Index(columnList = "user_id, name", name = "idx_categories_user_name") })
public class Category {
    // getters & setters
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Column(name = "user_id", columnDefinition = "uuid", nullable = false)
    private UUID userId;
    private String name;
    private String type;
    @Column(name = "is_default", nullable = false)
    private boolean defaultCategory = false;
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
    public Category() {}
}
