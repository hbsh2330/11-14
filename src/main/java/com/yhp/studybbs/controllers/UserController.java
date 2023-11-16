package com.yhp.studybbs.controllers;

import com.yhp.studybbs.entities.ContactCompanyEntity;
import com.yhp.studybbs.entities.EmailAuthEntity;
import com.yhp.studybbs.entities.UserEntity;
import com.yhp.studybbs.results.user.*;
import com.yhp.studybbs.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping(value = "user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "login",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLogin(@SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("user/login");
        } else {
            modelAndView.setViewName("redirect:/");
        }
        return modelAndView;
    }

    @RequestMapping(value = "login",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session,
                            UserEntity user) {
        LoginResult result = this.userService.login(session, user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public ModelAndView getLogout(HttpSession session) {
        session.setAttribute("user", null);
        return new ModelAndView("redirect:/");
    }

    @RequestMapping(value = "recoverEmail",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRecoverEmail(@SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("user/recoverEmail");
        } else {
            modelAndView.setViewName("redirect:/");
        }
        return modelAndView;
    }

    @RequestMapping(value = "recoverEmail",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverEmail(UserEntity user) {
        RecoverEmailResult result = this.userService.recoverEmail(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == RecoverEmailResult.SUCCESS) {
            responseObject.put("email", user.getEmail());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "register",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegister(@SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            ContactCompanyEntity[] contactCompanies = this.userService.getContactCompanies();
            modelAndView.setViewName("user/register");
            modelAndView.addObject("contactCompanies", contactCompanies);
        } else {
            modelAndView.setViewName("redirect:/");
        }
        return modelAndView;
    }

    @RequestMapping(value = "register",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(@RequestParam(value = "termMarketingAgreed") boolean termMarketingAgreed,
                               UserEntity user,
                               EmailAuthEntity emailAuth) {
        RegisterResult result = this.userService.register(user, emailAuth, termMarketingAgreed);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "registerEmail",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegisterEmail(EmailAuthEntity emailAuth) throws MessagingException {
        SendRegisterEmailResult result = this.userService.sendRegisterEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == SendRegisterEmailResult.SUCCESS) {
            responseObject.put("salt", emailAuth.getSalt());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "registerEmail",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRegisterEmail(EmailAuthEntity emailAuth) {
        VerifyRegisterEmailResult result = this.userService.verifyRegisterEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "resetPassword",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getResetPassword(@SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
        if (user == null) {
            modelAndView.setViewName("user/resetPassword");
        } else {
            modelAndView.setViewName("redirect:/");
        }
        return modelAndView;
    }

    @RequestMapping(value = "resetPasswordEmail",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postResetPasswordEmail(EmailAuthEntity emailAuth) throws MessagingException {
        SendResetPasswordEmailResult result = this.userService.sendResetPasswordEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == SendResetPasswordEmailResult.SUCCESS) {
            responseObject.put("salt", emailAuth.getSalt()); //자바스크립트의 salt부분과 맞아야함
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "resetPasswordEmail",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPasswordEmail(EmailAuthEntity emailAuth) {
        VerifyRegisterEmailResult result = this.userService.verifyRegisterEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "resetPassword",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPassword(UserEntity user){
        SendResetPasswordResult result= this.userService.sendResetPassword(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

}