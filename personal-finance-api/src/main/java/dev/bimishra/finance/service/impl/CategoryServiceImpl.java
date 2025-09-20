package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.entity.Category;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.CategoryMapper;
import dev.bimishra.finance.repository.CategoryRepository;
import dev.bimishra.finance.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;

    public CategoryServiceImpl(CategoryRepository repo, CategoryMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public List<CategoryDto> listByUser(UUID userId) {
        return repo.findByUserId(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<CategoryDto> findAllForUser(UUID userId) {
        return repo.findByIsDefaultTrueOrUserIdOrderByName(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto get(UUID id, UUID userId) {
        Category c = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!c.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        return mapper.toDto(c);
    }

    @Override
    public CategoryDto create(CategoryDto dto) {
        Category e = mapper.toEntity(dto);
        if (e.getId() == null) e.setId(UUID.randomUUID());
        return mapper.toDto(repo.save(e));
    }

    @Override
    public CategoryDto update(UUID id, CategoryDto dto, UUID userId) {
        Category existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        return mapper.toDto(repo.save(existing));
    }

    @Override
    public void delete(UUID id, UUID userId) {
        Category existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        repo.deleteById(id);
    }
}
