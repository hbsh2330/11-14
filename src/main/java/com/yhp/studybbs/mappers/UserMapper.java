package com.yhp.studybbs.mappers;

import com.yhp.studybbs.entities.ContactCompanyEntity;
import com.yhp.studybbs.entities.EmailAuthEntity;
import com.yhp.studybbs.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int insertEmailAuth(EmailAuthEntity emailAuth); //insert, Delete, update는 int형식

    int insertUser(UserEntity user);

    ContactCompanyEntity[] selectContactCompanies();

    EmailAuthEntity selectEmailAuthByEmailCodeSalt(@Param(value = "email") String email,
                                                   @Param(value = "code") String code,
                                                   @Param(value = "salt") String salt);

    UserEntity selectUserByContact(@Param(value = "contactFirst") String contactFirst,
                                   @Param(value = "contactSecond") String contactSecond,
                                   @Param(value = "contactThird") String contactThird);

    UserEntity selectUserByEmail(@Param(value = "email") String email);

    UserEntity selectUserByNickname(@Param(value = "nickname") String nickname);

    int updateEmailAuth(EmailAuthEntity emailAuth);

    int updateUser(UserEntity user);

}