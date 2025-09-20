package dev.bimishra.finance.controller;

import dev.bimishra.finance.config.UserPrincipal;
import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.service.TransactionService;
import dev.bimishra.finance.util.SecurityUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final TransactionService txnService;

    public ReportController(TransactionService txnService) {
        this.txnService = txnService;
    }

    // Monthly summary: total income and expense for a date range
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(@AuthenticationPrincipal UserPrincipal principal, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<TransactionDto> txns = txnService.listByUserBetween(userId, from, to);
        //FIXME: handle type properly
        double income = txns.stream().filter(t -> "CREDIT".equalsIgnoreCase(t.getType().toString())).mapToDouble(t -> t.getAmount().doubleValue()).sum();
        double expense = txns.stream().filter(t -> "DEBIT".equalsIgnoreCase(t.getType().toString())).mapToDouble(t -> t.getAmount().doubleValue()).sum();
        Map<String, Object> result = Map.of("from", from, "to", to, "income", income, "expense", expense, "net", income - expense);
        return ResponseEntity.ok(result);
    }

    // Category breakdown
    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Double>> byCategory(@AuthenticationPrincipal UserPrincipal principal, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<TransactionDto> txns = txnService.listByUserBetween(userId, from, to);
        Map<String, Double> grouped = txns.stream().collect(Collectors.groupingBy(t -> t.getCategoryId() != null ? t.getCategoryId().toString() : "uncategorized", Collectors.summingDouble(t -> t.getAmount().doubleValue())));
        return ResponseEntity.ok(grouped);
    }
}
