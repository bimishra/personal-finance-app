package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.dto.CategoryWithCountDto;
import dev.bimishra.finance.entity.Category;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.CategoryMapper;
import dev.bimishra.finance.repository.CategoryRepository;
import dev.bimishra.finance.repository.TransactionRepository;
import dev.bimishra.finance.service.CategoryService;
import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private final TransactionRepository txnRepo;

    public CategoryServiceImpl(CategoryRepository repo, CategoryMapper mapper, TransactionRepository txnRepo) {
        this.repo = repo;
        this.mapper = mapper;
        this.txnRepo = txnRepo;
    }

    @Override
    public List<CategoryDto> listByUser() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return repo.findByUserId(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<CategoryDto> findAllForUser() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return repo.findByDefaultCategoryTrueOrUserIdOrderByName(userId).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto get(UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Category c = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!c.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        return mapper.toDto(c);
    }

    @Override
    public CategoryDto create(CategoryDto dto) {
        Category e = mapper.toEntity(dto);
        e.setUserId(SecurityUtils.getCurrentUserId());
        return mapper.toDto(repo.save(e));
    }

    @Override
    public CategoryDto update(UUID id, CategoryDto dto) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Category existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        return mapper.toDto(repo.save(existing));
    }

    @Override
    public void delete(UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Category existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!existing.getUserId().equals(userId)) throw new ResourceNotFoundException("Category not found for user");
        repo.deleteById(id);
    }

    @Override
    public List<CategoryWithCountDto> listWithTransactionCounts() {
        UUID userId = SecurityUtils.getCurrentUserId();
        // Fetch categories visible to the user (default + user)
        List<Category> categories = repo.findByDefaultCategoryTrueOrUserIdOrderByName(userId);

        // Fetch counts grouped by category (category_id, count)
        List<Object[]> rows = txnRepo.findTransactionCountsGroupedByCategory(userId);
        Map<UUID, Long> counts = new HashMap<>();
        if (rows != null) {
            for (Object[] row : rows) {
                if (row == null || row.length < 2) continue;
                Object catIdObj = row[0];
                Object cntObj = row[1];
                UUID catId = null;
                if (catIdObj != null) {
                    try {
                        catId = UUID.fromString(catIdObj.toString());
                    } catch (IllegalArgumentException ex) {
                        // ignore invalid UUID representation
                        catId = null;
                    }
                }
                long cnt = 0L;
                if (cntObj instanceof Number) cnt = ((Number) cntObj).longValue();
                else {
                    try { cnt = Long.parseLong(cntObj.toString()); } catch (Exception ignored) {}
                }
                counts.put(catId, cnt);
            }
        }

        List<CategoryWithCountDto> out = new ArrayList<>();
        for (Category c : categories) {
            CategoryWithCountDto dto = new CategoryWithCountDto();
            dto.setId(c.getId());
            dto.setUserId(c.getUserId());
            dto.setName(c.getName());
            dto.setType(c.getType());
            dto.setDefaultCategory(c.isDefaultCategory());
            dto.setTransactionCount(counts.getOrDefault(c.getId(), 0L));
            out.add(dto);
        }

        return out;
    }
}
