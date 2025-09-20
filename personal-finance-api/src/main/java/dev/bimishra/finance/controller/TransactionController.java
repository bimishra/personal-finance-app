package dev.bimishra.finance.controller;

import dev.bimishra.finance.config.UserPrincipal;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.service.TransactionService;
import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService svc;

    public TransactionController(TransactionService svc) {
        this.svc = svc;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDto>> list(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        UUID userId = SecurityUtils.getCurrentUserId();
        if (from != null && to != null) {
            return ResponseEntity.ok(svc.listByUserBetween(userId, from, to));
        }
        return ResponseEntity.ok(svc.listByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> get(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(svc.get(id, userId));
    }

    @PostMapping
    public ResponseEntity<TransactionDto> create(@RequestBody TransactionDto dto, @AuthenticationPrincipal UserPrincipal principal) {
        dto.setUserId(SecurityUtils.getCurrentUserId());
        TransactionDto created = svc.create(dto);
        return ResponseEntity.created(URI.create("/api/v1/transactions/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> update(@PathVariable UUID id, @RequestBody TransactionDto dto, @AuthenticationPrincipal UserPrincipal principal) {
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
