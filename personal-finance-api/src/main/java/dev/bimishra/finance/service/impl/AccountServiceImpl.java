package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.dto.AccountDto;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.AccountMapper;
import dev.bimishra.finance.entity.Account;
import dev.bimishra.finance.repository.AccountRepository;
import dev.bimishra.finance.util.SecurityUtils;
import jdk.dynalink.linker.LinkerServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements dev.bimishra.finance.service.AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Transactional(readOnly = true)
    @Override
    public List<AccountDto> getUserAccounts() {
        UUID userId = SecurityUtils.getCurrentUserId();
        System.out.println("Fetching accounts for user: " + userId);
        return accountRepository.findByUserId(userId)
                .stream()
                .map(accountMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public AccountDto getAccountById(UUID id) {
        Account account = accountRepository.findByIdAndUserId(id, SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        return accountMapper.toDto(account);
    }

    @Transactional
    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        Account account = accountMapper.toEntity(accountDto);
        account.setUserId(SecurityUtils.getCurrentUserId());
        System.out.println("Creating account for user: " + account.getUserId());
        System.out.println("Account details: " + account);
        Account savedAccount = accountRepository.save(account);
        return accountMapper.toDto(savedAccount);
    }

    @Transactional
    @Override
    public AccountDto updateAccount(UUID id, AccountDto accountDto) {
        Account existingAccount = accountRepository.findByIdAndUserId(id, SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        accountMapper.updateEntityFromDto(accountDto, existingAccount);
        Account updatedAccount = accountRepository.save(existingAccount);
        return accountMapper.toDto(updatedAccount);
    }

    @Transactional
    @Override
    public void deleteAccount(UUID id) {
        Account account = accountRepository.findByIdAndUserId(id, SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        accountRepository.delete(account);
    }
}