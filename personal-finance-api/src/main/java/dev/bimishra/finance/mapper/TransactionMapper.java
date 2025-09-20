package dev.bimishra.finance.mapper;

import dev.bimishra.finance.dto.TransactionDto;
import dev.bimishra.finance.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(target = "createdAt", ignore = true)
    TransactionDto toDto(Transaction e);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currency", ignore = true) // assuming currency is set elsewhere
    @Mapping(target = "userId", ignore = true) // userId is set by the service layer, not from DTO
    Transaction toEntity(TransactionDto dto);
}
