<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
class GetCmsData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    private $CMS_DATA_FILE_PATH = null;

    public function __construct()
    {
        $this->CMS_DATA_FILE_PATH = storage_path('cms/cms.json');
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (!file_exists($this->CMS_DATA_FILE_PATH)) {
            file_put_contents($this->CMS_DATA_FILE_PATH, json_encode([]));
        }
        $slug = trim($request->path());
        $cmsData = json_decode(file_get_contents($this->CMS_DATA_FILE_PATH), true);
        $data = $cmsData[$slug] ?? [];
        Inertia::share('cmsData', $data);
        return $next($request);
    }

}
