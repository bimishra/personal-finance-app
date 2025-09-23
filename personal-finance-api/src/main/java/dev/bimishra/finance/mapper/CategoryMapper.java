package dev.bimishra.finance.mapper;

import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDto toDto(Category e);

    @Mapping(target = "defaultCategory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true) // userId is set in the service layer
    Category toEntity(CategoryDto dto);
}
