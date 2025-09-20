package dev.bimishra.finance.repository;

import dev.bimishra.finance.entity.IdentityLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdentityLinkRepository extends JpaRepository<IdentityLink, Long> {
    Optional<IdentityLink> findByProviderAndSubject(String provider, String subject);
}
