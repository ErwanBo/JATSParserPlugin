<?php

use APP\pages\article\ArticleHandler;
use APP\facades\Repo;

class FullTextArticleHandler extends ArticleHandler {

	var $_plugin;

	/**
	 * Constructor
	 */
	function __construct() {
		parent::__construct();
		$this->_plugin = PluginRegistry::getPlugin('generic', JATSPARSER_PLUGIN_NAME);
	}

	/**
	 * @param $args
	 * @param $request
	 * @brief download supplementary files for article's full-text
	 */
	function downloadFullTextAssoc($args, $request) {
		$fileId = $args[2];
		$dispatcher = $request->getDispatcher();
		if (empty($fileId) || !$this->article || !$this->publication) $dispatcher->handle404();

		if (!$this->userCanViewGalley($request, $this->article->getId())) {
			header('HTTP/1.0 403 Forbidden');
			echo '403 Forbidden<br>';
			exit;
		}

		$fullTextFileIds = $this->publication->getData('jatsParser::fullTextFileId');
		if (empty($fullTextFileIds)) $dispatcher->handle404();

		// Find if the file is an image dependent from the XML file, from which full-text was generated.
		$dependentFilesIterator = Repo::submissionFile()
			->getCollector()
			->filterByAssoc(
				Application::ASSOC_TYPE_SUBMISSION_FILE,
				array_values($fullTextFileIds)
			)
            ->filterBySubmissionIds([$this->article->getId()])
			->filterByFileStages([SubmissionFile::SUBMISSION_FILE_DEPENDENT])
			->includeDependentFiles()
			->getMany();

		if (is_null($dependentFilesIterator->first())) $dispatcher->handler404();

		$submissionFile = null;
		foreach ($dependentFilesIterator as $dependentFile) {
			if ($fileId == $dependentFile->getData('fileId')) {
				$submissionFile = $dependentFile;
				break;
			}
		}

		if (!$submissionFile) $dispatcher->handle404();

		if (!in_array($submissionFile->getData('mimetype'), $this->_plugin::getSupportedSupplFileTypes())) $dispatcher->handler404();

		// Download file if exists
		if (!Services::get('file')->fs->has($submissionFile->getData('path'))) {
			$request->getDispatcher()->handle404();
		}

		$filename = Services::get('file')->formatFilename($submissionFile->getData('path'), $submissionFile->getLocalizedData('name'));
		Services::get('file')->download($submissionFile->getData('fileId'), $filename);
	}
}
