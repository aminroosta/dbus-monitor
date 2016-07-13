[DBus (name="ir.samilab.server")]
interface ServerInterface: Object{
	public abstract string monitor_all() throws IOError;
	public abstract string monitor_pause() throws IOError;
	public abstract string monitor_file(string file_path) throws IOError;
}

void main(){
	var loop = new MainLoop();
	ServerInterface server = null;

	try{
		server = Bus.get_proxy_sync (BusType.SESSION, "ir.samilab.server", "/ir/samilab/server");
		string result = server.monitor_all();
		stdout.printf("%s\n",result);
		result = server.monitor_pause();
		stdout.printf("%s\n",result);
		result = server.monitor_file("/etc/profile");

		stdout.printf("%s\n",result);
	}
	catch (IOError e){
		stderr.printf("%s\n",e.message);
	}
	loop.run();
}
