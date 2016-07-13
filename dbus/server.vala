[DBus (name = "ir.samilab.server")]
public class Server{
	public string monitor_file (string file_path){
		string content;
		try{
			FileUtils.get_contents(file_path, out content);
		}
		catch (FileError e){
			stderr.printf("file \""+ file_path + "\"not found!\n");
		}
		return content;
	}
	
	public string monitor_all (){
		return "monitor_all function called.\n";
	}

	public string monitor_pause (){
		return "monitor_pause function called\n";
	}

}

void register_server(DBusConnection conn){
	try{
		conn.register_object ("/ir/samilab/server", new Server());
	}
	catch (IOError e){
		stderr.printf("Could not register service.\n");
	}
}

void main(){
	Bus.own_name (BusType.SESSION, "ir.samilab.server",
			BusNameOwnerFlags.NONE, register_server,
			()=> stdout.printf("Server succesfully registered on bus\n"),
			()=> stderr.printf("Could not register server\n"));
	new MainLoop().run();

}
