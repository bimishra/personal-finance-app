package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.dto.CategoryWithCountDto;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryDto> listByUser();

    List<CategoryDto> findAllForUser();

    CategoryDto get(UUID id);
    CategoryDto create(CategoryDto dto);
    CategoryDto update(UUID id, CategoryDto dto);
    void delete(UUID id);

    // Returns categories visible to the user (default + user) along with transaction counts for each category
    List<CategoryWithCountDto> listWithTransactionCounts();
}
