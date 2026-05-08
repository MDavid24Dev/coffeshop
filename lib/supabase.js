 /*
 Elementos que podemos ver aqui en / Lib
  Configuraciones
  Conexiones
  Helpers
 */

  //CONEXION DE SUPABASE 

  import {createClient} from '@supabase/supabase-js'; //crea conexion a supabase importandolo "Llamando db"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; //Lee URL de destino 🛤️🔒 con process

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Lee, la llave de esta Db🔑 con process

  // crea el cliente con los datos de validacion con lo parametros de entrada de las variables 
  // cargadas de la conexion
  export const supabase = createClient(supabaseUrl,supabaseAnonKey); 
