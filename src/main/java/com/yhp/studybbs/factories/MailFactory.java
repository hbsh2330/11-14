package com.yhp.studybbs.factories;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

public class MailFactory {

    public final Context context = new Context();

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final MimeMessage mimeMessage;
    private final MimeMessageHelper mimeMessageHelper;
    public MailFactory(JavaMailSender mailSender, SpringTemplateEngine templateEngine) throws MessagingException {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.mimeMessage = this.mailSender.createMimeMessage();
        this.mimeMessageHelper = new MimeMessageHelper(this.mimeMessage, false);
    }

    public void send(){
        this.mailSender.send(this.mimeMessage);
    }
    public MailFactory setContextVariable(String key, Object value){
        this.context.setVariable(key, value);
        return this; //클래스를 반환
    }
    public MailFactory setSubject(String subject) throws MessagingException {
        this.mimeMessageHelper.setSubject(subject);
        return this;
    }

    public MailFactory setTemplate(String template) throws MessagingException {
        this.mimeMessageHelper.setText(this.templateEngine.process(template, this.context), true);
        return this;
    }
    public MailFactory setTo(String to) throws MessagingException {
        this.mimeMessageHelper.setTo(to);
        return this;
    }
}
