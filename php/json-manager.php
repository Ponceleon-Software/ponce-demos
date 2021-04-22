<?php
namespace Ponce_Demos;

/**
 * Se encarga de manejar la información de los archivos JSON asociados
 * a ponce-demos.
 *
 */
class Json_Manager
{

    /**
     * Ruta al archivo ponce-demos.json
     *
     * @var string
     */
    public $file_all_demos;

    /**
     * Ruta a la carpeta con todos los json de meta datos
     *
     * @var string
     */
    public $folder_meta_data;

    /**
     * Guarda la data de los demos otenida por get_demos_array()
     *
     * @var array
     */
    public $demos_array;

    /**
     * Guarda todos los metadatos obtenidos, indexados por el id del demo
     *
     * @var array
     */
    public $obtained_meta_datas;

    /**
     * Constructor del manager de archivos json.
     *
     * @access public
     */
    public function __construct()
    {

        $this->demos_array = null;
        $this->file_all_demos = PONCE_DEMOS__DIR__ . '/ponce-demos.json';
        $this->folder_meta_data = PONCE_DEMOS_META_PATH;
        $this->obtained_meta_datas = [];

    }

    /**
     * Obtiene los datos del json de ponce demos una sola vez.
     * Si vuelve a llamarse devuelve la copia en memoria.
     *
     * @return array La data del json como un array
     */
    public function get_demos_array()
    {

        if (is_null($this->demos_array)) {
            $this->demos_array = $this->get_demos_from_json();
        }

        return $this->demos_array;

    }

    /**
     * Devuelve la data de un demo en el array de demos
     *
     * @param $id El id del demo
     *
     * @return array La data del demo.
     */
    public function get_demo_data(int $id)
    {

        return $this->get_demos_array()[$id];

    }

    /**
     * Obtiene los datos directamente del json de ponce demos.
     *
     * Cada vez que se ejecute se deberá hacer el proceso de extraccion
     * del json. Por obtimización es preferible usar get_demos_array()
     *
     * @access public
     * @return array La data del json como un array
     *
     */
    public function get_demos_from_json()
    {

        $json_string = file_get_contents($this->file_all_demos);

        $json_data = json_decode($json_string, true);

        return $json_data;

    }

    /**
     * Obtiene toda la metadata de un demo una sola vez
     *
     * @param $id El id del demo
     * @param $asociative Si devolver como un array llave => valor o
     * tal como está en el json de metadatos. Por defecto false.
     *
     * @return array|null Si el archivo existe retorna un array con
     * el contenido del json. Sino retorna null
     *
     * @since v1.0.0
     */
    public function get_meta_data(int $id, $asociative = false)
    {

        if (!array_key_exists($id, $this->obtained_meta_datas)) {

            $meta_data = $this->get_meta_data_from_json($id);
            if (!is_null($meta_data)) {
                $this->obtained_meta_datas[$id] = $meta_data;
            } else {
                return null;
            }

        }

        $meta_data = $this->obtained_meta_datas[$id];

        if($asociative){
            $metadata_array = [];

            foreach ($meta_data as $meta_dato) {
              $metadata_array[ $meta_dato['meta_key'] ] = $meta_dato['meta_value'];
            }

            $meta_data = $metadata_array;
        }

        return $meta_data;

    }

    /**
     * Obtiene toda la metadata de un demo directo desde el json
     *
     * @param $id El id del demo
     *
     * @return array|null Si el archivo existe retorna un array con
     * el contenido del json. Sino retorna null
     */
    public function get_meta_data_from_json(int $id)
    {

        $file_meta_data = $this->folder_meta_data . $id . '.json';

        if (!file_exists($file_meta_data)) {
            return null;
        }

        $json_file = file_get_contents($file_meta_data);
        $json_meta = json_decode($json_file, true);

        return $json_meta;

    }
}
