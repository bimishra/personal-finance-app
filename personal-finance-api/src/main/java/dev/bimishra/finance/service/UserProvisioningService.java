package dev.bimishra.finance.service;

import dev.bimishra.finance.dto.UserDto;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserProvisioningService {
    public UserDto resolveOrCreateUser(String provider, String subject, String email, String name);
}
