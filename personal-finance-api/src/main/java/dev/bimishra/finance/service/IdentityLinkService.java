package dev.bimishra.finance.service;

import java.util.UUID;

public interface IdentityLinkService {
    UUID getInternalUserId(String provider, String subject);
}
