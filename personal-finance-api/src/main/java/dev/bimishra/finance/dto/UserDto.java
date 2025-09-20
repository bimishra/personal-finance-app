package dev.bimishra.finance.dto;

import lombok.Data;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String email;
    private String displayName;

    public UserDto() {}

}
