package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.AccountDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface AccountService {
    @Transactional(readOnly = true)
    List<AccountDto> getUserAccounts();

    @Transactional(readOnly = true)
    AccountDto getAccountById(UUID id);

    @Transactional
    AccountDto createAccount(AccountDto accountDto);

    @Transactional
    AccountDto updateAccount(UUID id, AccountDto accountDto);

    @Transactional
    void deleteAccount(UUID id);
}
