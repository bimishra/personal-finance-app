package dev.bimishra.finance.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryDto {

    // getters/setters
    private UUID id;
    //userId is set by the service layer, not from DTO
    private UUID userId;
    private String name;
    private String type; // INCOME or EXPENSE
    private boolean defaultCategory = false;

    public CategoryDto() {
    }

}
