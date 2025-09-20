package dev.bimishra.finance.mapper;

import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {


    CategoryDto toDto(Category e);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toEntity(CategoryDto dto);
}
