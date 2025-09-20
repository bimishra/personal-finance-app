package dev.bimishra.finance.mapper;
import dev.bimishra.finance.dto.UserDto;
import dev.bimishra.finance.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    // Optional: if you need reverse mapping
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(UserDto dto);
}
