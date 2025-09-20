package dev.bimishra.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class RecurringTransactionDto {
    private UUID id;
    private UUID userId;
    private UUID accountId;
    private UUID categoryId;
    private String cronPattern;
    private String frequency;
    private LocalDate nextRunDate;
    private BigDecimal amount;
    private Boolean active;

    public RecurringTransactionDto() {}

    // getters/setters...
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getCronPattern() { return cronPattern; }
    public void setCronPattern(String cronPattern) { this.cronPattern = cronPattern; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public LocalDate getNextRunDate() { return nextRunDate; }
    public void setNextRunDate(LocalDate nextRunDate) { this.nextRunDate = nextRunDate; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
