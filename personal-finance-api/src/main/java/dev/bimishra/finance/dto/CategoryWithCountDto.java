package dev.bimishra.finance.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryWithCountDto {
    private UUID id;
    private UUID userId;
    private String name;
    private String type; // INCOME or EXPENSE
    private boolean defaultCategory = false;
    private long transactionCount = 0L;

    public CategoryWithCountDto() {
    }
}

