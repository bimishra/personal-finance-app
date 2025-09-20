package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.entity.IdentityLink;
import dev.bimishra.finance.repository.IdentityLinkRepository;
import dev.bimishra.finance.service.IdentityLinkService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IdentityLinkServiceImpl implements IdentityLinkService {
    private final IdentityLinkRepository linkRepository;

    public IdentityLinkServiceImpl(IdentityLinkRepository linkRepository) {
        this.linkRepository = linkRepository;
    }

    /**
     * Cache the mapping so repeated calls with same (provider, subject)
     * don't hit the DB every time.
     */
    @Override
    @Cacheable(value = "userLinkCache", key = "#provider + '|' + #subject")
    public UUID getInternalUserId(String provider, String subject) {
        return linkRepository.findByProviderAndSubject(provider, subject)
                .map(IdentityLink::getUser)
                .orElseThrow(() -> new IllegalStateException("User not provisioned")).getId();
    }
}
