package dev.bimishra.finance.controller;

import dev.bimishra.finance.config.UserPrincipal;
import dev.bimishra.finance.dto.CategoryDto;
import dev.bimishra.finance.service.CategoryService;
import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService svc;

    public CategoryController(CategoryService svc) { this.svc = svc; }

    @GetMapping("/v1")
    public ResponseEntity<List<CategoryDto>> listV1(@AuthenticationPrincipal UserPrincipal principal) {
        //System.out.println("JWT ID: " + jwt.getId());
        //System.out.println("JWT claim: " + jwt.getClaims());
        //System.out.println("JWT email: " + jwt.getClaimAsString("email"));
        UUID userId = SecurityUtils.getCurrentUserId();
        System.out.println("User ID: " + userId);
        return ResponseEntity.ok(svc.listByUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> list() {
        return ResponseEntity.ok(svc.findAllForUser(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> get(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(svc.get(id, userId));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto, @AuthenticationPrincipal UserPrincipal principal) {
        dto.setUserId(SecurityUtils.getCurrentUserId());
        CategoryDto created = svc.create(dto);
        return ResponseEntity.created(URI.create("/api/v1/categories/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> update(@PathVariable UUID id, @RequestBody CategoryDto dto, @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(svc.update(id, dto, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = SecurityUtils.getCurrentUserId();
        svc.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
