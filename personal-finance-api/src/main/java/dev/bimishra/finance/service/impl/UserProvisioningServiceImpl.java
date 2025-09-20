package dev.bimishra.finance.service.impl;

import dev.bimishra.finance.dto.UserDto;
import dev.bimishra.finance.entity.IdentityLink;
import dev.bimishra.finance.entity.User;
import dev.bimishra.finance.mapper.UserMapper;
import dev.bimishra.finance.repository.IdentityLinkRepository;
import dev.bimishra.finance.repository.UserRepository;
import dev.bimishra.finance.service.UserProvisioningService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;
@Service
public class UserProvisioningServiceImpl implements UserProvisioningService {
    private final IdentityLinkRepository identityRepo;
    private final UserRepository userRepo;
    private final UserMapper mapper;

    public UserProvisioningServiceImpl(IdentityLinkRepository identityRepo,
                                   UserRepository userRepo, UserMapper mapper) {
        this.identityRepo = identityRepo;
        this.userRepo = userRepo;
        this.mapper = mapper;
    }
    @Override
    @Transactional
    public UserDto resolveOrCreateUser(String issuer, String subject, String email, String name) {
        User user = identityRepo.findByProviderAndSubject(issuer, subject)
                .flatMap(identity -> userRepo.findById(identity.getUser().getId()))
                .orElseGet(() -> {
                    // create new User
                    User newUser = new User();
                    newUser.setId(UUID.randomUUID());
                    newUser.setEmail(email);
                    newUser.setDisplayName(name);

                    // save and flush to DB immediately
                    userRepo.saveAndFlush(newUser);

                    // now create mapping in IdentityLink
                    IdentityLink identity = new IdentityLink();
                    identity.setProvider(issuer);
                    identity.setSubject(subject);
                    identity.setUser(newUser);

                    identityRepo.saveAndFlush(identity);

                    return newUser;
                });
        return mapper.toDto(user);
    }
}
