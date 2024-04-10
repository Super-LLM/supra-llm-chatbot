from langchain.tools import DuckDuckGoSearchRun
from langchain_core.tools import BaseTool


class Hoas_appartment(BaseTool):
    """
    This is a tool for searching hoas apartments
    """
    name = "@ba"
    description = "use this tool when you need to search information related to find a apartment in Finland."

    def _run(self, query: str):
        docs = DuckDuckGoSearchRun().run(f"site:hoas.fi/en/ {query}")
        return docs

    def _arun(self, query: str):
        raise NotImplementedError("This tool does not support async")


class Immigration_RP(BaseTool):
    """
    This is a tool for searching migri.fi for immigration related topics.
    """
    name = "@ba"
    description = "use this tool when you need to search information related to apply for a Finnish resident permit."

    def _run(self, query: str):
        docs = DuckDuckGoSearchRun().run(f"site:migri.fi/en/home/ {query}")
        return docs

    def _arun(self, query: str):
        raise NotImplementedError("This tool does not support async")


class Study_programme(BaseTool):
    """
    This is a tool for searching opintopolku.fi for information about study programmes in Finland.
    """
    name = "@ba"
    description = "use this tool when you need to search information related to find a suitable study programme in Finland."

    def _run(self, query: str):
        docs = DuckDuckGoSearchRun().run(f"site:opintopolku.fi/konfo/en/ {query}")
        return docs

    def _arun(self, query: str):
        raise NotImplementedError("This tool does not support async")
