package org.baat.web.controller;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

import static org.baat.core.constants.Constants.X_AUTH_TOKEN;

@Controller
public class WebController {

	@Value("${user_service_uri}")
	private String userServiceURI;

	@RequestMapping(value = {"/", "home"})
	public String home(@CookieValue(value = X_AUTH_TOKEN, required = false) final String userToken) {
		if (validUserToken(userToken)) {
			return "home/home.html";
		} else {
			return "login/login.html";
		}
	}

	@RequestMapping(value = "/signup")
	public String signup() {
		return "signup/signup.html";
	}

	@RequestMapping(value = "/login")
	public String login() {
		return "login/login.html";
	}

	@RequestMapping(value = "/logout")
	public String logout() {
		return "login/logout.html";
	}

	private boolean validUserToken(final String userToken) {
		if (StringUtils.isEmpty(userToken)) {
			return false;
		}

		try {
			return BooleanUtils.isTrue(new RestTemplate().getForObject(
					URI.create(userServiceURI + "/validateUserToken/" + userToken), Boolean.class));
		} catch (Exception exception) {
			//TODO error logging
			return false;
		}
	}
}