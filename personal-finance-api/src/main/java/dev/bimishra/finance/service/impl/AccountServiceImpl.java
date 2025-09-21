package dev.bimishra.finance.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bimishra.finance.config.AccountConfig;
import dev.bimishra.finance.dto.AccountDto;
import dev.bimishra.finance.entity.Account;
import dev.bimishra.finance.exception.ResourceNotFoundException;
import dev.bimishra.finance.mapper.AccountMapper;
import dev.bimishra.finance.repository.AccountRepository;
import dev.bimishra.finance.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements dev.bimishra.finance.service.AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final AccountConfig accountConfig;

    @Transactional(readOnly = true)
    @Override
    public List<AccountDto> getUserAccounts() {
        UUID userId = SecurityUtils.getCurrentUserId();
        log.debug("Fetching accounts for user: {}", userId);
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
        UUID userId = SecurityUtils.getCurrentUserId();
        log.info("Creating account for user: {}", userId);

        long existingAccounts = accountRepository.countByUserId(userId);
        if (existingAccounts >= accountConfig.getMaxPerUser()) {
            throw new IllegalStateException(
                    "User already has the maximum allowed accounts (" + accountConfig.getMaxPerUser() + ")."
            );
        }

        Account account = accountMapper.toEntity(accountDto);
        account.setUserId(userId);
        log.debug("Account details: {}", account);

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
