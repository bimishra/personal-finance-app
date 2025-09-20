package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.CategoryDto;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryDto> listByUser(UUID userId);

    List<CategoryDto> findAllForUser(UUID userId);

    CategoryDto get(UUID id, UUID userId);
    CategoryDto create(CategoryDto dto);
    CategoryDto update(UUID id, CategoryDto dto, UUID userId);
    void delete(UUID id, UUID userId);
}
