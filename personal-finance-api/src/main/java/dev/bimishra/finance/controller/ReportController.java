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
import java.util.LinkedHashMap;
import java.math.BigDecimal;

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

    // New: daily timeseries endpoint (net amount per day)
    @GetMapping("/timeseries/balance")
    public ResponseEntity<Map<String, Object>> timeseries(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        // Validate parameters
        if (from == null || to == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Both 'from' and 'to' parameters are required and must be ISO dates."));
        }
        if (from.isAfter(to)) {
            return ResponseEntity.badRequest().body(Map.of("error", "'from' must be on or before 'to'."));
        }
        if (to.isAfter(from.plusYears(1))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Range cannot exceed 1 year."));
        }

        UUID userId = SecurityUtils.getCurrentUserId();
        Map<LocalDate, BigDecimal> series = txnService.getDailyNetAmounts(userId, from, to);

        Map<String, BigDecimal> out = new LinkedHashMap<>();
        for (Map.Entry<LocalDate, BigDecimal> e : series.entrySet()) {
            out.put(e.getKey().toString(), e.getValue());
        }

        return ResponseEntity.ok(Map.of(
                "from", from,
                "to", to,
                "series", out
        ));
    }

    // New: separated daily timeseries for income and expense
    @GetMapping("/timeseries")
    public ResponseEntity<Map<String, Object>> timeseriesSeparated(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        // Validate parameters
        if (from == null || to == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Both 'from' and 'to' parameters are required and must be ISO dates."));
        }
        if (from.isAfter(to)) {
            return ResponseEntity.badRequest().body(Map.of("error", "'from' must be on or before 'to'."));
        }
        if (to.isAfter(from.plusYears(1))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Range cannot exceed 1 year."));
        }

        UUID userId = SecurityUtils.getCurrentUserId();
        Map<String, Map<LocalDate, BigDecimal>> separated = txnService.getDailyIncomeExpense(userId, from, to);

        Map<LocalDate, BigDecimal> incomeSeries = separated.getOrDefault("income", Map.of());
        Map<LocalDate, BigDecimal> expenseSeries = separated.getOrDefault("expense", Map.of());

        Map<String, BigDecimal> incomeOut = new LinkedHashMap<>();
        Map<String, BigDecimal> expenseOut = new LinkedHashMap<>();

        for (Map.Entry<LocalDate, BigDecimal> e : incomeSeries.entrySet()) {
            incomeOut.put(e.getKey().toString(), e.getValue());
        }
        for (Map.Entry<LocalDate, BigDecimal> e : expenseSeries.entrySet()) {
            expenseOut.put(e.getKey().toString(), e.getValue());
        }

        return ResponseEntity.ok(Map.of(
                "from", from,
                "to", to,
                "income", incomeOut,
                "expense", expenseOut
        ));
    }
}
