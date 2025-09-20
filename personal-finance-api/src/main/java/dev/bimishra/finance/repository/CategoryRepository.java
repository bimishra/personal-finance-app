package dev.bimishra.finance.repository;


import dev.bimishra.finance.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserId(UUID userId);
    //@Query("SELECT c FROM Category c WHERE c.isDefault = TRUE OR c.user.id = :userId ORDER BY c.type, c.name")
    List<Category> findByIsDefaultTrueOrUserIdOrderByName(@Param("userId") UUID userId);

}
