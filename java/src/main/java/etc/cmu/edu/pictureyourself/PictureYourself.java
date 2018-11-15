package etc.cmu.edu.pictureyourself;

import io.undertow.Undertow;
import io.undertow.server.HttpHandler;
import io.undertow.server.handlers.PathHandler;
import io.undertow.servlet.api.DeploymentInfo;
import io.undertow.servlet.api.DeploymentManager;
import io.undertow.websockets.WebSocketConnectionCallback;
import io.undertow.websockets.core.AbstractReceiveListener;
import io.undertow.websockets.core.BufferedTextMessage;
import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.core.WebSockets;
import io.undertow.websockets.spi.WebSocketHttpExchange;

import javax.servlet.ServletException;

import static io.undertow.servlet.Servlets.defaultContainer;
import static io.undertow.servlet.Servlets.deployment;
import static io.undertow.servlet.Servlets.servlet;
import static io.undertow.Handlers.websocket;
import io.undertow.Handlers;

public class PictureYourself {
    public PictureYourself() throws Exception {
    }

    public static final String PATH = "/PictureYourself";

    public static void main(String[] args) throws Exception {
        try {
            DeploymentInfo servletBuilder = deployment()
                    .setClassLoader(PictureYourself.class.getClassLoader())
                    .setContextPath(PATH)
                    .setDeploymentName("handler.war")
                    .addServlets(
                            servlet("PictureServlet", PictureServlet.class)
                            .addMapping("/picture"),
                            servlet("QuestionServlet", QuestionServlet.class)
                            .addMapping("/question"),
                            servlet("MatchServlet", MatchServlet.class)
                            .addMapping("/match"),
                            servlet("CheckUpdateServlet", CheckUpdateServlet.class)
                            .addMapping("/checkupdate")
                    );
            DeploymentManager manager = defaultContainer().addDeployment(servletBuilder);
            manager.deploy();

            HttpHandler servletHandler = manager.start();
            PathHandler path = Handlers.path(Handlers.redirect(PATH))
                    .addPrefixPath(PATH, servletHandler)
                    .addPrefixPath("/WebSocket", websocket(new WebSocketConnectionCallback() {
						
						@Override
						public void onConnect(WebSocketHttpExchange exchange, WebSocketChannel channel) {
							// TODO Auto-generated method stub
							channel.getReceiveSetter().set(new AbstractReceiveListener() {
								@Override
								protected void onFullTextMessage(WebSocketChannel channel, BufferedTextMessage message) {
									String data = message.getData();
									//System.out.println(data);
									//WebSockets.sendText(data, channel, null);
//									for (WebSocketChannel session : channel.getPeerConnections()) {
//										WebSockets.sendText(data, session, null);
//									}
									if (Model.instance().isUpdate) {
                                        //System.out.println("isUpdate");
										for (WebSocketChannel session : channel.getPeerConnections()) {
											//WebSockets.sendText(data, session, null);
											WebSockets.sendText(Model.instance().country, session, null);
										}
										Model.instance().isUpdate = false;
									}
								}
							});
							channel.resumeReceives();
						}
					}));

            Undertow server = Undertow.builder()
                    .addHttpListener(8080, "0.0.0.0")
                    .setHandler(path)
                    .build();
            server.start();
        } catch (ServletException e) {
            throw new RuntimeException(e);
        }
    }
}
