package dev.bimishra.finance.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class CategoryDto {
    // getters/setters
    private UUID id;
    //userId is set by the service layer, not from DTO
    private UUID userId;
    private String name;
    private String type;

    public CategoryDto(){}

}
