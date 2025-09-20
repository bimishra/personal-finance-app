package dev.bimishra.finance.dto;

import dev.bimishra.finance.entity.Transaction;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Setter
@Getter
public class TransactionDto {
    // getters/setters
    private UUID id;
    private UUID accountId;
    //userId is set by the service layer, not from DTO
    private UUID userId;
    private UUID categoryId;
    private BigDecimal amount;
    //currency should be set by backend as per account currency
    private String currency;
    private LocalDate txnDate;
    private String description;
    private Transaction.TransactionType type;

    //createdAt is set by the service layer, not from DTO
    private OffsetDateTime createdAt;


    public TransactionDto(){}

}
