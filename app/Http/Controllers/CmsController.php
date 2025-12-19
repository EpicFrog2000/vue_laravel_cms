<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    private $CMS_DATA_FILE_PATH = null;

    public function __construct()
    {
        $this->CMS_DATA_FILE_PATH = public_path('json/cms.json');
    }

    public function updateCmsData(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string',
            'data' => 'required'
        ]);

        if (!file_exists($this->CMS_DATA_FILE_PATH)) {
            file_put_contents($this->CMS_DATA_FILE_PATH, json_encode([]));
        }

        $dir = storage_path('cms_history');
        if(!is_dir($dir)){
            mkdir($dir, 0777, true);
        }
        $backupPath = $dir.'/cms_backup_'.date('Ymd_His').'.json';
        copy($this->CMS_DATA_FILE_PATH, $backupPath);

        $cmsData = json_decode(file_get_contents($this->CMS_DATA_FILE_PATH), true) ?: [];
        if (!isset($cmsData[$validated['slug']])) {
            $cmsData[$validated['slug']] = [];
        }
        $cmsData[$validated['slug']] = array_replace_recursive($cmsData[$validated['slug']], $validated['data']);
        file_put_contents($this->CMS_DATA_FILE_PATH, json_encode($cmsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return response(200);
    }

    public function getFilesList()
    {
        $path = public_path('images');

        if (!File::exists($path)) {
            return response('brak images', 500);
        }

        $files = File::files($path);

        $fileNames = collect($files)
            ->sortByDesc(fn($file) => $file->getMTime())
            ->map(fn($file) => '/images/'.$file->getFilename())
            ->filter(fn($filename) => !str_starts_with($filename, '.'))
            ->values();

        return response()->json($fileNames, 200);
    }


    public function uploadFile(Request $request){
        $chunk = $request->file('chunk');
        $filename = $request->input('filename');
        $start = (int)$request->input('start');
        $path = public_path('images/' . $filename);

        if (!$chunk) return response('no chunk', 400);

        file_put_contents($path, file_get_contents($chunk), $start === 0 ? 0 : FILE_APPEND);

        return response()->json(['ok' => true]);
    }


    public function getPagesList(){
        if (!File::exists($this->CMS_DATA_FILE_PATH)) {
            return response('nie znalexiono pliku z danymi cms',500);
        }

        $pagesList=array_keys(json_decode(file_get_contents($this->CMS_DATA_FILE_PATH),true)??[]);

        return response()->json($pagesList, 200);
    }

    public function getPageSettings(Request $request){
        $slug = $request->query('slug');
        if(!$slug){
            return response('nie podano slug',400);
        }

        if(!File::exists($this->CMS_DATA_FILE_PATH)){
            return response('nie znalexiono pliku z danymi cms',500);
        }

        $pages = json_decode(file_get_contents($this->CMS_DATA_FILE_PATH), true) ?? [];
        return response()->json($pages[$slug]['settings'] ?? [],200);
    }

    public function savePageSettings(Request $request){
        $validated = $request->validate([
            'slug' => 'required|string',
            'settings' => 'required'
        ]);

        if(!File::exists($this->CMS_DATA_FILE_PATH)){
            return response('nie znalexiono pliku z danymi cms',500);
        }

        $dir = storage_path('cms_history');
        if(!is_dir($dir)){
            mkdir($dir, 0777, true);
        }

        $backupPath = $dir.'/cms_backup_'.date('Ymd_His').'.json';
        copy($this->CMS_DATA_FILE_PATH, $backupPath);

        $cmsData = json_decode(file_get_contents($this->CMS_DATA_FILE_PATH), true) ?: [];
        if (!isset($cmsData[$validated['slug']]['settings'])) {
            $cmsData[$validated['slug']]['settings'] = [];
        }
        $cmsData[$validated['slug']]['settings'] = array_replace_recursive($cmsData[$validated['slug']]['settings'], $validated['settings']);
        file_put_contents($this->CMS_DATA_FILE_PATH, json_encode($cmsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return response(200);
    }
}
