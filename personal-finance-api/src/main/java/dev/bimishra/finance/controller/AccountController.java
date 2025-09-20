package dev.bimishra.finance.controller;

import dev.bimishra.finance.dto.AccountDto;
import dev.bimishra.finance.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get all accounts for current user")
    public ResponseEntity<List<AccountDto>> getUserAccounts() {
        return ResponseEntity.ok(accountService.getUserAccounts());
    }

    /*@GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get account by ID")
    public ResponseEntity<AccountDto> getAccount(@PathVariable UUID id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }*/

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new account")
    public ResponseEntity<AccountDto> createAccount(@Valid @RequestBody AccountDto accountDto) {
        return ResponseEntity.ok(accountService.createAccount(accountDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update an existing account")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable UUID id, @Valid @RequestBody AccountDto accountDto) {
        return ResponseEntity.ok(accountService.updateAccount(id, accountDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete an account")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}