package dev.bimishra.finance.mapper;

import dev.bimishra.finance.dto.BudgetDto;
import dev.bimishra.finance.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BudgetMapper {

    BudgetDto toDto(Budget e);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Budget toEntity(BudgetDto dto);
}
