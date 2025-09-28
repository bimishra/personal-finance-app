package dev.bimishra.finance.controller;

import dev.bimishra.finance.config.UserPrincipal;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.service.TransactionService;
import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService svc;
    private static final int MAX_PAGE_SIZE = 100; // guard to avoid large single-page queries

    public TransactionController(TransactionService svc) {
        this.svc = svc;
    }

    /**
     * List transactions for current user.
     * Backward-compatible behavior: if no pagination parameters (page/size/sort) are provided, this returns the full list as before.
     * If pagination parameters are present, returns a paged response with the shape: { content, page, size, totalElements, totalPages, last }
     */
    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal UserPrincipal principal,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                                  Pageable pageable,
                                  HttpServletRequest request) {

        UUID userId = SecurityUtils.getCurrentUserId();

        boolean paginationRequested = request.getParameter("page") != null || request.getParameter("size") != null || request.getParameter("sort") != null;

        // Apply page size cap when pagination is requested
        if (paginationRequested) {
            int size = pageable.getPageSize() <= 0 ? 20 : pageable.getPageSize();
            int cappedSize = Math.min(size, MAX_PAGE_SIZE);
            pageable = PageRequest.of(pageable.getPageNumber(), cappedSize, pageable.getSort());
        }

        // If a date range was provided
        if (from != null && to != null) {
            if (paginationRequested) {
                Page<TransactionDto> page = svc.listByUserBetween(userId, from, to, pageable);
                return ResponseEntity.ok(pagedResponse(page));
            } else {
                List<TransactionDto> results = svc.listByUserBetween(userId, from, to);
                return ResponseEntity.ok(results);
            }
        }

        // No date range: return either paged or full list depending on presence of pagination params
        if (paginationRequested) {
            Page<TransactionDto> page = svc.listByUser(userId, pageable);
            return ResponseEntity.ok(pagedResponse(page));
        } else {
            List<TransactionDto> results = svc.listByUser(userId);
            return ResponseEntity.ok(results);
        }
    }

    private Map<String, Object> pagedResponse(Page<TransactionDto> page) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", page.getContent());
        body.put("page", page.getNumber());
        body.put("size", page.getSize());
        body.put("totalElements", page.getTotalElements());
        body.put("totalPages", page.getTotalPages());
        body.put("last", page.isLast());
        return body;
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
