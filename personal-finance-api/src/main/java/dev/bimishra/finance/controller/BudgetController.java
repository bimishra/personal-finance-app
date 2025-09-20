package dev.bimishra.finance.controller;

import dev.bimishra.finance.config.UserPrincipal;
import dev.bimishra.finance.dto.BudgetDto;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.service.BudgetService;
import dev.bimishra.finance.service.TransactionService;

import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    private final BudgetService svc;


    public BudgetController(BudgetService svc) { this.svc = svc; }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> list(
                                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
        UUID userId = SecurityUtils.getCurrentUserId();
        if (month != null) {
            return ResponseEntity.ok(svc.listByUserAndMonth(userId, month));
        }
        return ResponseEntity.ok(svc.listByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDto> get(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(svc.get(id, userId));
    }

    @PostMapping
    public ResponseEntity<BudgetDto> create(@RequestBody BudgetDto dto, @AuthenticationPrincipal UserPrincipal principal) {
        dto.setUserId(SecurityUtils.getCurrentUserId());
        BudgetDto created = svc.create(dto);
        return ResponseEntity.created(URI.create("/api/v1/budgets/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDto> update(@PathVariable UUID id, @RequestBody BudgetDto dto, @AuthenticationPrincipal UserPrincipal principal) {
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
